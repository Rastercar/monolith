<script lang="ts">
	import {
		createSvelteTable,
		flexRender,
		getCoreRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type PaginationState,
		type TableOptions,
		type Updater
	} from '@tanstack/svelte-table';
	import { writable } from 'svelte/store';

	type Person = {
		firstName: string;
		lastName: string;
		age: number;
	};

	const defaultData: Person[] = [
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24
		},
		{
			firstName: 'tandy',
			lastName: 'miller',
			age: 40
		},
		{
			firstName: 'joe',
			lastName: 'dirte',
			age: 45
		},
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24
		},
		{
			firstName: 'tandy',
			lastName: 'miller',
			age: 40
		},
		{
			firstName: 'joe',
			lastName: 'dirte',
			age: 45
		},
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24
		},
		{
			firstName: 'tandy',
			lastName: 'miller',
			age: 40
		},
		{
			firstName: 'joe',
			lastName: 'dirte',
			age: 45
		},
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24
		},
		{
			firstName: 'tandy',
			lastName: 'miller',
			age: 40
		},
		{
			firstName: 'joe',
			lastName: 'dirte',
			age: 45
		},
		{
			firstName: 'tanner',
			lastName: 'linsley',
			age: 24
		}
	];

	const defaultColumns: ColumnDef<Person>[] = [
		{
			accessorKey: 'firstName',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			accessorFn: (row) => row.lastName,
			id: 'lastName',
			cell: (info) => info.getValue(),
			header: () => 'Last Name',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'age',
			header: () => 'Age',
			footer: (info) => info.column.id
		}
	];

	let pagination = { pageIndex: 1, pageSize: 2 };

	const nextPage = () => {
		options.update((old) => {
			const pageIndex = (old.state?.pagination?.pageIndex || 0) + 1;

			return {
				...old,
				state: {
					pagination: { pageSize: 2, pageIndex }
				}
			};
		});
	};

	const setPagination = (updater: Updater<PaginationState>) => {
		if (updater instanceof Function) {
			pagination = updater(pagination);
		} else {
			pagination = updater;
		}

		options.update((old) => ({
			...old,
			state: {
				...old.state,
				pagination
			}
		}));
	};

	// Aqui temos paginacao client side, com (manualPagination = false) e (getPaginationRowModel = true)
	//
	// para paginacao server side seria (manualPagination = true) e (getPaginationRowModel = false)
	//
	// onde autualizariamos o pagination state na mao atraves da sync com o estado de paginação, provavelmente teriamos nosso proprio
	// componente ou precisamos fazer um sync do estado dele e do paginator do skeleton ui
	const options = writable<TableOptions<Person>>({
		data: defaultData,
		columns: defaultColumns,
		// manualPagination: true,
		state: { pagination },
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});

	// TODO: rm me ?!
	const rerender = () => {
		options.update((options) => ({
			...options,
			data: defaultData
		}));
	};

	const table = createSvelteTable(options);
</script>

<div class="h-full flex items-center justify-center space-x-4">
	<div>
		<table class="bg-slate-700">
			<thead>
				{#each $table.getHeaderGroups() as headerGroup}
					<tr>
						{#each headerGroup.headers as header}
							<th class="p-4 border-x-2 border-t-2">
								{#if !header.isPlaceholder}
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>

			<tbody class="border-2">
				{#each $table.getRowModel().rows as row}
					<tr>
						{#each row.getVisibleCells() as cell}
							<td class="p-4 border-t-2">
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>

			<tfoot>
				<!-- {#each $table.getFooterGroups() as footerGroup}
				<tr>
					{#each footerGroup.headers as header}
						<th>
							{#if !header.isPlaceholder}
								<svelte:component
									this={flexRender(header.column.columnDef.footer, header.getContext())}
								/>
							{/if}
						</th>
					{/each}
				</tr>
			{/each} -->
			</tfoot>
		</table>

		<div class="mt-4 flex space-x-4">
			<button
				class="p-2 bg-slate-500"
				on:click={() => {
					console.log('previous');
					$table.previousPage();
				}}
			>
				previous
			</button>

			<button
				class="p-2 bg-slate-500"
				on:click={() => {
					console.log('next');
					nextPage();
				}}
			>
				next
			</button>

			<button
				class="p-2 bg-slate-500"
				on:click={() => {
					console.log('setting page size');
					$table.setPageSize(1);
				}}
			>
				page size
			</button>

			<!-- <Paginator
				settings={{ page: 0, limit: 5, size: 10, amounts: [1, 2, 5, 10] }}
				showNumerals
				maxNumerals={4}
				on:page={(e) => {
					setPage(e.detail);
				}}
			/> -->
		</div>
	</div>
</div>
