"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { LoginButton } from "@/components/ui/login-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { cn } from "@/lib/utils";
import { colors, containerPadding, gap } from "@/lib/design-tokens";

// --- New Animation Components ---

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "#FFFFFF",
  pupilColor = "#2D2D2D",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150 shadow-sm"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

// --- Main Page Component ---

type AuthMode = "signin" | "signup";

export function LoginPage({ mode = "signin" }: { mode?: AuthMode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("User already logged in, redirecting...");

          // Fetch profile to know where to redirect
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .maybeSingle();

          const target = profile?.onboarding_completed ? "/" : "/onboarding";

          // Use window.location.href for a hard redirect to ensure we leave the page
          window.location.href = target;
        } else {
          setIsCheckingAuth(false);
        }
      } catch (e) {
        setIsCheckingAuth(false);
      }
    };

    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Start true to hide form
  const [error, setError] = useState("");
  const [magicStatus, setMagicStatus] = useState<"idle" | "sent">("idle");
  const [magicMessage, setMagicMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animation States
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");

  useEffect(() => setMounted(true), []);

  // Mouse Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking Effects
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = (setBlink: (v: boolean) => void) => {
      const blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          scheduleBlink(setBlink);
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };

    const t1 = scheduleBlink(setIsPurpleBlinking);
    const t2 = scheduleBlink(setIsBlackBlinking);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Looking at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Peeking anim
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };
      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  // --- Helper for Password Validation ---
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Şifre en az 8 karakter olmalıdır.";
    if (!/[A-Z]/.test(pwd)) return "Şifre en az bir büyük harf içermelidir.";
    if (!/[a-z]/.test(pwd)) return "Şifre en az bir küçük harf içermelidir.";
    if (!/[0-9]/.test(pwd)) return "Şifre en az bir rakam içermelidir.";
    return null;
  };

  // Auth Handling
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password complexity for signup
    if (mode === "signup") {
      const validationError = validatePassword(password);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        if (data.session) {
          // Navigate to home, middleware will redirect to /onboarding if needed
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
        } else {
          setMagicStatus("sent");
          setMagicMessage("Lütfen e-postanızı kontrol edin.");
          setIsLoading(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        console.log("Login success, navigating to home...");
        // Small delay to ensure cookies are synced, then navigate to home
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Generic error message for security (User Enumeration protection)
      if (mode === "signin") {
        setError("Giriş yapılamadı. Lütfen e-posta ve şifrenizi kontrol edin.");
      } else {
        setError(err.message || "Bir hata oluştu.");
      }
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) {
        console.error("Google sign-in error:", error);
        setError(error.message || "Google ile giriş yapılamadı. Lütfen tekrar deneyin.");
        setIsLoading(false);
      }
      // If successful, user will be redirected, so don't set loading to false
    } catch (err: any) {
      console.error("Google sign-in exception:", err);
      setError(err.message || "Google ile giriş yapılamadı. Lütfen tekrar deneyin.");
      setIsLoading(false);
    }
  };

  const copy =
    mode === "signin"
      ? {
        title: "Hoş Geldiniz",
        subtitle: "Lütfen giriş yapın",
        primaryCta: "Giriş Yap",
        switchPrompt: "Hesabınız yok mu?",
        switchText: "Hemen Abone Ol",
        switchHref: "/subscribe",
      }
      : {
        title: "Hesap Oluştur",
        subtitle: "Scrolli'ye katılın",
        primaryCta: "Kayıt Ol",
        switchPrompt: "Zaten üye misiniz?",
        switchText: "Giriş Yap",
        switchHref: "/sign-in",
      };

  if (!mounted || isCheckingAuth) return null;

  return (
    <div className={cn("grid min-h-screen lg:grid-cols-2", colors.background.base)}>
      {/* Left Content Section */}
      <div
        className={cn(
          "relative hidden lg:flex flex-col justify-between overflow-hidden transition-colors duration-300",
          containerPadding.xl,
          colors.background.base
        )}
      >
        <div className={cn("relative z-20 flex items-center", gap.sm)}>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isDark ? "/assets/images/Standart/Primary.svg" : "/assets/images/Standart/Primary-alternative.svg"}
              alt="Scrolli Logo"
              width={120}
              height={40}
              unoptimized
              priority
              className="logo-image"
            />
          </Link>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {/* Main Visual Container */}
          <div className="relative" style={{ width: "550px", height: "400px" }}>
            {/* Purple Character - Back Layer (#1) */}
            <div
              ref={purpleRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "70px",
                width: "180px",
                height:
                  isTyping || (password.length > 0 && !showPassword)
                    ? "440px"
                    : "400px",
                backgroundColor: "#16A34A", // Brand Green
                borderRadius: "10px 10px 0 0",
                zIndex: 1,
                transform:
                  password.length > 0 && showPassword
                    ? `skewX(0deg)`
                    : isTyping || (password.length > 0 && !showPassword)
                      ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                      : `skewX(${purplePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? `${20}px`
                      : isLookingAtEachOther
                        ? `${55}px`
                        : `${45 + purplePos.faceX}px`,
                  top:
                    password.length > 0 && showPassword
                      ? `${35}px`
                      : isLookingAtEachOther
                        ? `${65}px`
                        : `${40 + purplePos.faceY}px`,
                }}
              >
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? isPurplePeeking
                        ? 4
                        : -4
                      : isLookingAtEachOther
                        ? 3
                        : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? isPurplePeeking
                        ? 5
                        : -4
                      : isLookingAtEachOther
                        ? 4
                        : undefined
                  }
                />
                <EyeBall
                  size={18}
                  pupilSize={7}
                  maxDistance={5}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? isPurplePeeking
                        ? 4
                        : -4
                      : isLookingAtEachOther
                        ? 3
                        : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? isPurplePeeking
                        ? 5
                        : -4
                      : isLookingAtEachOther
                        ? 4
                        : undefined
                  }
                />
              </div>
            </div>

            {/* Black Character - Middle Layer (#2) */}
            <div
              ref={blackRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "240px",
                width: "120px",
                height: "310px",
                backgroundColor: "#2D2D2D", // Black
                borderRadius: "8px 8px 0 0",
                zIndex: 2,
                transform:
                  password.length > 0 && showPassword
                    ? `skewX(0deg)`
                    : isLookingAtEachOther
                      ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10
                      }deg) translateX(20px)`
                      : isTyping || (password.length > 0 && !showPassword)
                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                        : `skewX(${blackPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? `${10}px`
                      : isLookingAtEachOther
                        ? `${32}px`
                        : `${26 + blackPos.faceX}px`,
                  top:
                    password.length > 0 && showPassword
                      ? `${28}px`
                      : isLookingAtEachOther
                        ? `${12}px`
                        : `${32 + blackPos.faceY}px`,
                }}
              >
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther
                        ? 0
                        : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther
                        ? -4
                        : undefined
                  }
                />
                <EyeBall
                  size={16}
                  pupilSize={6}
                  maxDistance={4}
                  eyeColor="white"
                  pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther
                        ? 0
                        : undefined
                  }
                  forceLookY={
                    password.length > 0 && showPassword
                      ? -4
                      : isLookingAtEachOther
                        ? -4
                        : undefined
                  }
                />
              </div>
            </div>

            {/* Orange Semi-Circle - Front Left (#3) */}
            <div
              ref={orangeRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "0px",
                width: "240px",
                height: "200px",
                zIndex: 3,
                backgroundColor: "#FF9B6B", // Orange
                borderRadius: "120px 120px 0 0",
                transform:
                  password.length > 0 && showPassword
                    ? `skewX(0deg)`
                    : `skewX(${orangePos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-8 transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? `${50}px`
                      : `${82 + (orangePos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? `${85}px`
                      : `${90 + (orangePos.faceY || 0)}px`,
                }}
              >
                <EyeBall
                  size={20}
                  pupilSize={10}
                  maxDistance={5}
                  eyeColor="#FFFFFF"
                  pupilColor="#2D2D2D"
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
                <EyeBall
                  size={20}
                  pupilSize={10}
                  maxDistance={5}
                  eyeColor="#FFFFFF"
                  pupilColor="#2D2D2D"
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
              </div>
            </div>

            {/* Yellow Tall Rectangle - Front Right (#4) */}
            <div
              ref={yellowRef}
              className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: "310px",
                width: "140px",
                height: "230px",
                backgroundColor: "#E8D754", // Yellow
                borderRadius: "70px 70px 0 0",
                zIndex: 4,
                transform:
                  password.length > 0 && showPassword
                    ? `skewX(0deg)`
                    : `skewX(${yellowPos.bodySkew || 0}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div
                className="absolute flex gap-6 transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? `${20}px`
                      : `${52 + (yellowPos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? `${35}px`
                      : `${40 + (yellowPos.faceY || 0)}px`,
                }}
              >
                <EyeBall
                  size={20}
                  pupilSize={10}
                  maxDistance={5}
                  eyeColor="#FFFFFF"
                  pupilColor="#2D2D2D"
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
                <EyeBall
                  size={20}
                  pupilSize={10}
                  maxDistance={5}
                  eyeColor="#FFFFFF"
                  pupilColor="#2D2D2D"
                  forceLookX={password.length > 0 && showPassword ? -5 : undefined}
                  forceLookY={password.length > 0 && showPassword ? -4 : undefined}
                />
              </div>
              {/* Mouth */}
              <div
                className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
                style={{
                  left:
                    password.length > 0 && showPassword
                      ? `${10}px`
                      : `${40 + (yellowPos.faceX || 0)}px`,
                  top:
                    password.length > 0 && showPassword
                      ? `${88}px`
                      : `${88 + (yellowPos.faceY || 0)}px`,
                }}
              />
            </div>
          </div>
        </div>

        <div className={cn("relative z-20 text-xs flex gap-4", colors.foreground.muted)}>
          <a href="#">Gizlilik Bilgisi</a>
          <a href="#">Kullanım Şartları</a>
        </div>
      </div>

      {/* Right Content Section (Auth Form) */}
      <div
        className={cn(
          "flex flex-col items-center justify-center relative",
          containerPadding.md,
          "md:px-16",
          colors.background.base
        )}
      >
        <div className="absolute right-8 top-8">
          <CinematicThemeSwitcher />
        </div>

        <div className="w-full max-w-sm space-y-10">
          <div className="text-center">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Link href="/">
                <Image
                  src={isDark ? "/assets/images/Standart/Primary.svg" : "/assets/images/Standart/Primary-alternative.svg"}
                  alt="Scrolli Logo"
                  width={140}
                  height={46}
                  unoptimized
                  priority
                  className="logo-image"
                />
              </Link>
            </div>
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight mb-2",
                colors.foreground.primary
              )}
            >
              {copy.title}
            </h1>
            <p className={cn(colors.foreground.secondary, "font-medium")}>
              {copy.subtitle}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={colors.foreground.primary}>
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                placeholder="isim@ornek.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className={colors.foreground.primary}>
                  Şifre
                </Label>
                <a href="#" className="text-xs text-green-600 hover:underline">
                  Unuttum?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 !bg-transparent !border-none !shadow-none !outline-none p-1 hover:opacity-70 transition-colors",
                    colors.foreground.primary
                  )}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md border border-red-100 dark:border-red-900/30">
                {error}
              </div>
            )}
            {magicStatus === "sent" && (
              <div className="p-3 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md border border-green-100 dark:border-green-900/30">
                {magicMessage}
              </div>
            )}

            <LoginButton
              type="submit"
              variant={isDark ? "beige" : "dark"}
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Bekleyin..." : copy.primaryCta}
            </LoginButton>

            {!isLoading && (
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError("Sihirli bağlantı için e-posta gerekli.");
                    return;
                  }
                  setIsLoading(true);
                  const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                      emailRedirectTo: `${window.location.origin}/auth/callback`,
                      // CRITICAL: Use PKCE flow for SSR compatibility
                      // This ensures the code verifier is stored in cookies
                      shouldCreateUser: true,
                    },
                  });
                  if (error) setError(error.message);
                  else {
                    setMagicStatus("sent");
                    setMagicMessage("Sihirli bağlantı e-postanıza gönderildi.");
                  }
                  setIsLoading(false);
                }}
                className={cn(
                  "text-xs text-center transition-colors mt-2 hover:text-green-600 underline underline-offset-4 !bg-transparent !border-none !shadow-none !outline-none w-full",
                  colors.foreground.primary
                )}
              >
                Sihirli bağlantı (şifresiz) ile giriş yap
              </button>
            )}
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span
                className={cn(
                  "px-4",
                  colors.background.base,
                  colors.foreground.muted
                )}
              >
                Veya
              </span>
            </div>
          </div>

          <LoginButton
            onClick={handleGoogle}
            variant={isDark ? "beige" : "dark"}
            size="lg"
            className="flex gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google ile Giriş
          </LoginButton>

          <p className={cn("text-center text-sm", colors.foreground.muted)}>
            {copy.switchPrompt}{" "}
            <a
              href={copy.switchHref}
              className="text-green-600 font-bold hover:underline"
            >
              {copy.switchText}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export const Component = LoginPage;
