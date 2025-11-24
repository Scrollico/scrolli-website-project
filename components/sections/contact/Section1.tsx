"use client";

import { useState, FormEvent } from "react";
import { Container } from "@/components/responsive";
import { Heading } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SmartButton } from "@/components/ui/smart-button";
import {
  sectionPadding,
  gap,
  colors,
  componentPadding,
  typography,
  fontWeight,
  borderRadius,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Section1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agree: checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus({
        type: "success",
        message: "Your message has been sent successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        agree: false,
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={cn(sectionPadding.xl, colors.background.base)}>
      <Container size="lg" padding="lg">
        <div className={cn("flex flex-col lg:flex-row", gap.xl)}>
          {/* Left Side - Background Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block lg:w-1/2 relative overflow-hidden rounded-lg"
          >
            <div className="relative w-full h-full min-h-[600px]">
              <Image
                src="https://cdn.prod.website-files.com/63b053ef35937392bd426a55/67965c7b0ad59049d74d0c05_Open%20Laptop%20Minimal%20Office%20Nov%2027.webp"
                alt="Office workspace"
                fill
                className="object-cover blur-sm"
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 lg:w-1/2"
          >
            <div className={cn("flex flex-col", gap.lg)}>
              {/* Heading */}
              <div className={cn("flex flex-col", gap.sm)}>
                <Heading level={1} variant="h1" color="primary">
                  Contact us
                </Heading>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className={cn("flex flex-col", gap.lg)}>
                {submitStatus.type && (
                  <div
                    className={cn(
                      componentPadding.md,
                      borderRadius.md,
                      submitStatus.type === "success"
                        ? colors.success.bg
                        : colors.error.bg,
                      submitStatus.type === "success"
                        ? colors.success.DEFAULT
                        : colors.error.DEFAULT,
                      typography.bodySmall
                    )}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Name and Email Row */}
                <div className={cn("grid grid-cols-1 md:grid-cols-2", gap.md)}>
                  {/* Name Field */}
                  <div className={cn("flex flex-col", gap.sm)}>
                    <Label htmlFor="name" className={cn(typography.bodySmall, fontWeight.medium, colors.foreground.primary)}>
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={cn(colors.background.base, colors.border.DEFAULT)}
                    />
                  </div>

                  {/* Email Field */}
                  <div className={cn("flex flex-col", gap.sm)}>
                    <Label htmlFor="email" className={cn(typography.bodySmall, fontWeight.medium, colors.foreground.primary)}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={cn(colors.background.base, colors.border.DEFAULT)}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className={cn("flex flex-col", gap.sm)}>
                  <Label htmlFor="message" className={cn(typography.bodySmall, fontWeight.medium, colors.foreground.primary)}>
                    Your message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={cn(colors.background.base, colors.border.DEFAULT)}
                  />
                </div>

                {/* Checkbox */}
                <div className={cn("flex items-start", gap.sm)}>
                  <Checkbox
                    id="agree"
                    checked={formData.agree}
                    onCheckedChange={handleCheckboxChange}
                    required
                  />
                  <Label
                    htmlFor="agree"
                    className={cn(
                      typography.bodySmall,
                      colors.foreground.secondary,
                      "cursor-pointer"
                    )}
                  >
                    Agree Thank you!
                  </Label>
                </div>

                {/* Submit Button */}
                <SmartButton
                  type="submit"
                  disabled={isSubmitting || !formData.agree}
                  width="auto"
                  size="md"
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </SmartButton>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
