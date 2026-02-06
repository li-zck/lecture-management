import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/shadcn/card";
import { Shield, Lock, Eye, Database, Bell, Users } from "lucide-react";

export const metadata: Metadata = {
	title: "Privacy Policy | LMS",
	description:
		"Learn how we collect, use, and protect your personal information in our Lecture Management System.",
};

const sections = [
	{
		icon: Database,
		title: "Information We Collect",
		content: [
			"**Account Information**: When you register, we collect your name, email address, student/lecturer ID, and department affiliation.",
			"**Academic Data**: Course enrollments, grades, attendance records, and academic schedules.",
			"**Usage Data**: Login times, pages visited, and features used to improve our services.",
			"**Uploaded Content**: Documents, course materials, and profile images you choose to upload.",
		],
	},
	{
		icon: Eye,
		title: "How We Use Your Information",
		content: [
			"**Academic Services**: To provide course enrollment, grade tracking, scheduling, and other educational features.",
			"**Communication**: To send notifications about courses, grades, announcements, and system updates.",
			"**System Improvement**: To analyze usage patterns and improve the platform's functionality and user experience.",
			"**Administrative Purposes**: To manage user accounts, verify identities, and maintain system security.",
		],
	},
	{
		icon: Users,
		title: "Information Sharing",
		content: [
			"**Within the Institution**: Your academic information is shared with relevant faculty, administrators, and departments as necessary for educational purposes.",
			"**Lecturers**: Can view enrolled students' names, IDs, and academic performance in their courses.",
			"**Students**: Cannot access other students' personal information or grades.",
			"**Third Parties**: We do not sell or share your personal information with external parties for marketing purposes.",
		],
	},
	{
		icon: Lock,
		title: "Data Security",
		content: [
			"**Encryption**: All data is encrypted in transit using TLS/SSL and at rest using industry-standard encryption.",
			"**Access Control**: Role-based access ensures users only see information relevant to their role (student, lecturer, or admin).",
			"**Authentication**: Secure login with hashed passwords and session management.",
			"**Regular Audits**: We conduct security reviews to identify and address potential vulnerabilities.",
		],
	},
	{
		icon: Bell,
		title: "Your Rights & Choices",
		content: [
			"**Access**: You can view and download your personal data through your account settings.",
			"**Correction**: Request corrections to inaccurate personal information by contacting support.",
			"**Notifications**: Manage your notification preferences in account settings.",
			"**Account Deletion**: Contact your institution's administrator to request account deletion (subject to academic record retention policies).",
		],
	},
	{
		icon: Shield,
		title: "Data Retention",
		content: [
			"**Active Accounts**: Your data is retained while your account is active.",
			"**Academic Records**: Grades and enrollment history may be retained according to institutional policies and legal requirements.",
			"**Inactive Accounts**: Accounts inactive for extended periods may be archived or deleted per institutional policy.",
			"**Backups**: Secure backups are maintained for disaster recovery purposes.",
		],
	},
];

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

export default function PrivacyPage() {
	return (
		<div className="container mx-auto max-w-4xl px-6 py-12">
			{/* Header */}
			<div className="text-center mb-12">
				<div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
					<Shield className="h-8 w-8 text-primary" />
				</div>
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
					Privacy Policy
				</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Your privacy is important to us. This policy explains how we collect,
					use, and protect your personal information in the Lecture Management
					System.
				</p>
				<p className="text-sm text-muted-foreground mt-4">
					Last updated: January 2025
				</p>
			</div>

			{/* Introduction */}
			<Card className="mb-8 border-border/50">
				<CardContent className="p-6">
					<p className="text-muted-foreground leading-relaxed">
						The Lecture Management System (LMS) is committed to protecting the
						privacy of students, lecturers, and administrators. This Privacy
						Policy describes our practices regarding the collection, use, and
						disclosure of information through our platform. By using our
						services, you agree to the collection and use of information in
						accordance with this policy.
					</p>
				</CardContent>
			</Card>

			{/* Sections */}
			<div className="space-y-6">
				{sections.map((section) => (
					<Card key={section.title} className="border-border/50">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
									<section.icon className="h-5 w-5 text-primary" />
								</div>
								{section.title}
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<ul className="space-y-3">
								{section.content.map((item) => (
									<li
										key={item}
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
					<h2 className="text-xl font-semibold mb-3">Questions or Concerns?</h2>
					<p className="text-muted-foreground mb-4">
						If you have any questions about this Privacy Policy or our data
						practices, please contact us through our support page.
					</p>
					<a
						href="/support"
						className="inline-flex items-center text-primary hover:underline font-medium"
					>
						Contact Support →
					</a>
				</CardContent>
			</Card>

			{/* Footer Note */}
			<p className="text-sm text-muted-foreground text-center mt-8">
				This privacy policy is subject to change. We will notify users of any
				significant changes through the platform.
			</p>
		</div>
	);
}
