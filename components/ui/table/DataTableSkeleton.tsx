import { Skeleton } from "@/components/ui/shadcn/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/shadcn/table";

type DataTableSkeletonProps = {
	rows?: number;
	columns?: number;
};

export function DataTableSkeleton({
	rows = 5,
	columns = 4,
}: DataTableSkeletonProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{Array.from({ length: columns }).map((_, i) => (
							<TableHead key={i}>
								<Skeleton className="h-4 w-24" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rows }).map((_, rowIndex) => (
						<TableRow key={rowIndex}>
							{Array.from({ length: columns }).map((_, colIndex) => (
								<TableCell key={colIndex}>
									<Skeleton className="h-4 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
