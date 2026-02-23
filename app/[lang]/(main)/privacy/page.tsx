import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { Shield, Lock, Eye, Database, Bell, Users } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy | LMS",
	description:
		"Learn how we collect, use, and protect your personal information in our Lecture Management System.",
};

const sectionKeys = [
	"collect",
	"use",
	"sharing",
	"security",
	"rights",
	"retention",
] as const;

const icons = [Database, Eye, Users, Lock, Bell, Shield];

function formatContent(text: string) {
	// Convert **bold** to styled spans
	const parts = text.split(/(\*\*[^*]+\*\*)/g);
	return parts.map((part) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			const content = part.slice(2, -2);
			return (
				<span key={content} className="font-semibold text-foreground">
					{content}
				</span>
			);
		}
		return part;
	});
}

type PrivacyPageProps = {
	params: Promise<{ lang?: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
	const resolved = await params;
	const lang = resolved?.lang || "en";
	const locale = isLocale(lang) ? lang : "en";
	const dict = await getDictionary(locale);

	const contentArrays = [
		dict.privacy.collectContent,
		dict.privacy.useContent,
		dict.privacy.sharingContent,
		dict.privacy.securityContent,
		dict.privacy.rightsContent,
		dict.privacy.retentionContent,
	];

	return (
		<div className="container mx-auto max-w-4xl px-6 py-12">
			{/* Header */}
			<div className="text-center mb-12">
				<div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<Shield className="h-8 w-8 text-primary" />
				</div>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
					{dict.privacy.title}
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					{dict.privacy.subtitle}
				</p>
				<p className="text-sm text-muted-foreground mt-4">
					{dict.privacy.lastUpdated}
				</p>
			</div>

			{/* Introduction */}
			<Card className="mb-8 border-border/50">
				<CardContent className="p-6">
					<p className="text-muted-foreground leading-relaxed">
						{dict.privacy.intro}
					</p>
				</CardContent>
			</Card>

			{/* Sections */}
			<div className="space-y-6">
				{sectionKeys.map((key, i) => (
					<Card key={key} className="border-border/50">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									{(() => {
										const Icon = icons[i];
										return <Icon className="h-5 w-5 text-primary" />;
									})()}
								</div>
								{dict.privacy.sections[key]}
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ul className="space-y-3">
								{contentArrays[i].map((item) => (
									<li
										key={item.slice(0, 50)}
										className="text-muted-foreground leading-relaxed pl-4 border-l-2 border-border"
									>
										{formatContent(item)}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Contact Section */}
			<Card className="mt-8 border-border/50 bg-muted/30">
				<CardContent className="p-6 text-center">
					<h2 className="text-xl font-semibold mb-3">{dict.privacy.contactTitle}</h2>
					<p className="text-muted-foreground mb-4">
						{dict.privacy.contactDesc}
					</p>
					<Link
						href={`/${locale}/support`}
						className="inline-flex items-center text-primary hover:underline font-medium"
					>
						{dict.privacy.contactSupport} →
					</Link>
				</CardContent>
			</Card>

			{/* Footer Note */}
			<p className="text-sm text-muted-foreground text-center mt-8">
				{dict.privacy.footerNote}
			</p>
		</div>
	);
}
