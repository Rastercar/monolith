<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import Icon from '@iconify/svelte';
	import { Combobox } from 'bits-ui';
	import { Control, Label } from 'formsnap';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import SnippetOrString from '../svelte-specific/SnippetOrString.svelte';
	import type { FieldProps } from './field';
	import FieldWithErrors from './primitives/FieldWithErrors.svelte';

	type Props = {
		options: { label: string; value: string }[];
	} & FieldProps<T, U, HTMLInputAttributes>;

	const {
		form,
		name,
		label,
		options,
		classes = '',
		inputClass = 'input',
		labelClass = 'label mb-2 text-sm',
		labelExtraClasses = '',
		...fieldAttributes
	}: Props = $props();

	let searchValue = $state('');

	const filteredOptions = $derived.by(() => {
		if (searchValue === '') return options;
		return options.filter((o) => o.label.toLowerCase().includes(searchValue.toLowerCase()));
	});

	// TODO: esse componente funciona mas esta bugado, como Combobox.Input não suporta
	// binds para o value, não é possível resetar o valor quando de acordo com a mudança
	// do formulário, etc.
	//
	// além disso esse componente do bits ui não se comporta como um text field com sugestões
	// mas sim como um select com filtro de texto, então provavelmente teremos que implementar
	// nosso proprio select com um dropdown de sugestões

	const { form: formData } = form;
</script>

<FieldWithErrors {form} {name} wrapperClasses={classes}>
	<Control let:attrs>
		<Combobox.Root
			{name}
			type="single"
			controlledValue
			value={$formData[name] as string}
			onValueChange={(v) => {
				searchValue = v;
				$formData[name] = v as any;
			}}
		>
			<div class="relative">
				<Label class={`${labelClass} ${labelExtraClasses}`}>
					<SnippetOrString children={label} />
				</Label>

				<Combobox.Input
					class={inputClass}
					oninput={(e) => {
						const filter = e.currentTarget.value;

						searchValue = filter;
						$formData[name] = filter as any;
					}}
					{...fieldAttributes}
					{...attrs}
				/>
				<Combobox.Trigger class="absolute end-2 top-1/2 ">
					<Icon icon="mdi:caret-down" height={28} />
				</Combobox.Trigger>
			</div>

			<Combobox.Portal>
				<Combobox.Content
					class="max-h-96 w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] bg-surface-100-900 rounded"
					sideOffset={10}
				>
					<Combobox.ScrollUpButton class="flex justify-center bg-surface-200-800">
						<Icon icon="mdi:caret-up" height={32} />
					</Combobox.ScrollUpButton>

					<Combobox.Viewport>
						{#each filteredOptions as option, i (i + option.value)}
							<Combobox.Item
								class="flex h-10 w-full select-none items-center rounded-button py-3 pl-5 type-scale-2 data-[highlighted]:bg-surface-300-700"
								value={option.value}
								label={option.label}
							>
								{#snippet children({ selected })}
									{option.label}
									{#if selected}
										<Icon icon="mdi:check" class="ml-auto mr-3" />
									{/if}
								{/snippet}
							</Combobox.Item>
						{:else}
							<span class="block px-5 py-2 text-sm text-muted-foreground">
								No results found, try again.
							</span>
						{/each}
					</Combobox.Viewport>

					<Combobox.ScrollDownButton class="flex justify-center bg-surface-200-800">
						<Icon icon="mdi:caret-down" height={32} />
					</Combobox.ScrollDownButton>
				</Combobox.Content>
			</Combobox.Portal>
		</Combobox.Root>
	</Control>
</FieldWithErrors>
