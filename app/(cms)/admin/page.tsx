import { SignOutButton } from "@/components/admin";
import { Button } from "@/components/ui/shadcn/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminHomepage() {
	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<SignOutButton />
				</div>

				<Link href="/admin/management">
					<Button>
						Go to management page
						<ArrowRight />
					</Button>
				</Link>

				{/* <div className="rounded-lg shadow p-6"> */}
				{/* 	<h2 className="text-xl font-semibold mb-4">Recent Activity</h2> */}
				{/* 	<div className="space-y-4"> */}
				{/* 		<div className="flex items-center justify-between py-2 border-b"> */}
				{/* 			<div> */}
				{/* 				<p className="text-sm font-medium">New user registered</p> */}
				{/* 				<p className="text-sm">2 hours ago</p> */}
				{/* 			</div> */}
				{/* 			<span className="text-sm">View</span> */}
				{/* 		</div> */}
				{/* 	</div> */}
				{/* </div> */}
			</div>
		</div>
	);
}
