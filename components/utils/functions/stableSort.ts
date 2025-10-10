export const stableSort = <T>(arr: T[], compare: (a: T, b: T) => number) => {
	return arr
		.map((item, index) => ({ item, index }))
		.sort(
			(a: { item: T; index: number }, b: { item: T; index: number }) =>
				compare(a.item, b.item) || a.index - b.index,
		)
		.map(({ item }) => item);
};
