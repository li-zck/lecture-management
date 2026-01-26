"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { CheckCircle2, Home, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function SupportSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-border/50 shadow-lg overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </motion.div>

              {/* Success Message */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Request Submitted Successfully!
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Thank you for reaching out. Your support request has been
                  received and assigned a ticket number.
                </p>
              </div>

              {/* Ticket Info */}
              <div className="bg-muted/50 rounded-lg p-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Support Ticket Number
                </p>
                <p className="text-2xl font-bold font-mono text-primary">
                  #{Math.floor(Math.random() * 900000 + 100000)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Please save this number for your records
                </p>
              </div>

              {/* Next Steps */}
              <div className="text-left bg-muted/30 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      You'll receive a confirmation email shortly with your ticket
                      details
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Our support team will review your request within 24 hours
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      You'll be notified via email when there's an update on your
                      ticket
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      Average response time is 2-4 business hours
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/" className="flex-1">
                  <Button
                    variant="default"
                    className="w-full h-11 shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
                <Link href="/support" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-11 transition-all duration-200 group"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Submit Another Request
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Urgent issue?{" "}
              <span className="text-foreground font-medium">
                Call us at +1 (555) 123-4567
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
