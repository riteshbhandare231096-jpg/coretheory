import { ExternalBlob, createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubscription } from "@/hooks/useSubscription";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Accessibility,
  CheckCircle2,
  Dumbbell,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  Sparkles,
  Upload,
  UserPlus,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type AuthTab = "signin" | "signup";

interface AuthPageProps {
  onNavigate: (
    view:
      | "home"
      | "browse"
      | "search"
      | "pricing"
      | "disabled-dashboard"
      | "women-dashboard",
  ) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [tab, setTab] = useState<AuthTab>("signin");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const { login, loginStatus } = useInternetIdentity();
  const { actor } = useActor(createActor);
  const { isLoggedIn, profile, fetchProfile, isDisabledVerified, isFounder } =
    useSubscription();

  // UDID upload state
  const [udidFile, setUdidFile] = useState<File | null>(null);
  const [udidUploading, setUdidUploading] = useState(false);
  const [udidSuccess, setUdidSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLoading = loginStatus === "logging-in";

  const handleAuth = () => {
    login();
  };

  const handleUdidFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5 MB.");
      return;
    }
    setUdidFile(file);
  };

  const handleUdidSubmit = async () => {
    if (!udidFile || !actor) return;
    setUdidUploading(true);
    try {
      // 1. Read file bytes
      const arrayBuffer = await udidFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // 2. Upload bytes to object-storage via the actor's internal _uploadFile
      const blob = ExternalBlob.fromBytes(bytes);
      const actorInternal = actor as unknown as {
        _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>;
      };
      const hashBytes = await actorInternal._uploadFile(blob);
      const uploadPath = new TextDecoder().decode(hashBytes);

      // 3. Register the storage path with the backend
      const result = await actor.submitUdidUpload(uploadPath);
      if (result.__kind__ === "ok") {
        setUdidSuccess(true);
        await fetchProfile();
        toast.success(
          "UDID verified! Redirecting to your Disability Dashboard…",
        );
        setTimeout(() => onNavigate("disabled-dashboard"), 1500);
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setUdidUploading(false);
    }
  };

  const showUdidConfirmed =
    isLoggedIn && (isDisabledVerified || profile?.udidVerified);

  // Founder always has full access — skip UDID prompts entirely
  const showDisabilitySection = !isFounder;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Dumbbell className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-display font-bold text-gradient">
              CORE Theory
            </span>{" "}
            — Your Fitness Hub
          </p>
        </div>

        {/* ── DISABILITY SECTION — shown FIRST, hidden for founder ── */}
        {showDisabilitySection && (
          <div
            className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
            data-ocid="auth.disability_section"
          >
            <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-border bg-primary/5">
              <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Accessibility className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-foreground text-sm">
                  Are you a person with disability?
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get free access to the Disability Dashboard with curated
                  exercises.
                </p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {!isLoggedIn ? (
                <div
                  className="flex items-start gap-3 bg-muted/50 rounded-xl p-4 text-sm"
                  data-ocid="auth.disability_login_prompt"
                >
                  <LogIn className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">
                    Please{" "}
                    <span className="font-semibold text-primary">
                      sign in below
                    </span>{" "}
                    first, then return to this section to upload your UDID card
                    for free disability access.
                  </span>
                </div>
              ) : showUdidConfirmed ? (
                <div
                  className="flex items-center gap-3 bg-primary/8 border border-primary/25 rounded-xl p-4"
                  data-ocid="auth.disability_verified_state"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      You already have disability access
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate("disabled-dashboard")}
                      data-ocid="auth.go_disability_dashboard_button"
                      className="text-xs text-primary hover:underline font-medium mt-0.5 transition-smooth"
                    >
                      Go to Disability Dashboard →
                    </button>
                  </div>
                </div>
              ) : udidSuccess ? (
                <div
                  className="flex items-center gap-3 bg-primary/8 border border-primary/25 rounded-xl p-4"
                  data-ocid="auth.disability_success_state"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-semibold text-foreground">
                    UDID submitted! Redirecting…
                  </p>
                </div>
              ) : (
                <div className="space-y-3" data-ocid="auth.udid_upload_section">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload your{" "}
                    <span className="font-semibold text-foreground">
                      UDID (Unique Disability ID)
                    </span>{" "}
                    card to receive free access to the Disability Dashboard.
                  </p>

                  <label
                    htmlFor="udid-file-input"
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-smooth hover:border-primary/50 hover:bg-primary/5 block ${
                      udidFile
                        ? "border-primary/40 bg-primary/5"
                        : "border-border"
                    }`}
                    data-ocid="auth.udid_dropzone"
                  >
                    <input
                      ref={fileInputRef}
                      id="udid-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleUdidFileChange}
                      data-ocid="auth.udid_file_input"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    {udidFile ? (
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px] mx-auto">
                        {udidFile.name}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Click to upload — JPG, PNG or PDF, max 5 MB
                      </p>
                    )}
                  </label>

                  <Button
                    onClick={handleUdidSubmit}
                    disabled={!udidFile || udidUploading}
                    size="sm"
                    data-ocid="auth.udid_submit_button"
                    className="w-full gap-2 font-semibold"
                  >
                    {udidUploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Accessibility className="w-4 h-4" />
                        Submit UDID &amp; Get Free Access
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SIGN IN / SIGN UP CARD ── */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div
            className="grid grid-cols-2 border-b border-border"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "signin"}
              onClick={() => setTab("signin")}
              data-ocid="auth.signin_tab"
              className={`py-4 text-sm font-semibold transition-smooth flex items-center justify-center gap-2 ${
                tab === "signin"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "signup"}
              onClick={() => setTab("signup")}
              data-ocid="auth.signup_tab"
              className={`py-4 text-sm font-semibold transition-smooth flex items-center justify-center gap-2 ${
                tab === "signup"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div
              className={`rounded-xl p-4 border text-sm leading-relaxed ${
                tab === "signin"
                  ? "bg-primary/8 border-primary/20 text-foreground"
                  : "bg-accent/8 border-accent/20 text-foreground"
              }`}
            >
              {tab === "signin" ? (
                <p>
                  <span className="font-semibold text-primary">
                    Welcome back!
                  </span>{" "}
                  Sign in with your Internet Identity to access your
                  subscription and premium features.
                </p>
              ) : (
                <p>
                  <span className="font-semibold text-primary">
                    New to CORE Theory?
                  </span>{" "}
                  Create your secure identity below — no password needed, just
                  your device biometric or passkey.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="auth-passphrase"
                className="text-sm font-medium text-foreground"
              >
                {tab === "signin"
                  ? "Recovery Passphrase (optional)"
                  : "Set a Passphrase Hint"}
              </Label>
              <div className="relative">
                <Input
                  id="auth-passphrase"
                  type={showPassphrase ? "text" : "password"}
                  placeholder={
                    tab === "signin"
                      ? "Enter your recovery passphrase…"
                      : "Choose a passphrase hint…"
                  }
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  data-ocid="auth.passphrase_input"
                  className="pr-10 bg-background border-input focus:border-primary transition-smooth"
                  autoComplete={
                    tab === "signin" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase((prev) => !prev)}
                  aria-label={
                    showPassphrase ? "Hide passphrase" : "Show passphrase"
                  }
                  data-ocid="auth.toggle_passphrase_button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  {showPassphrase ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {tab === "signin"
                  ? "Used only if you set a recovery phrase when creating your identity."
                  : "Optional — helps you recall your identity if you switch devices."}
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleAuth}
              disabled={isLoading}
              data-ocid="auth.submit_button"
              className="w-full gap-2 font-semibold text-base shadow-md transition-smooth"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Connecting…
                </>
              ) : tab === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In with Internet Identity
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Identity &amp; Sign Up
                </>
              )}
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
              <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
              <span>
                Internet Identity uses your device's biometric sensor or passkey
                — no passwords are ever stored or sent to any server.
              </span>
            </div>
          </div>
        </div>

        {/* Feature tease for sign-up */}
        {tab === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Sparkles, text: "Unlimited CORE AI" },
              { icon: Dumbbell, text: "All 50+ exercises" },
              { icon: Shield, text: "Secure by default" },
              { icon: UserPlus, text: "No password needed" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2.5"
              >
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
