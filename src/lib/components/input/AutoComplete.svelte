<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts" module>
	import { slide } from 'svelte/transition';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type SlideTransition = typeof slide;
	type TransitionIn = Transition;
	type TransitionOut = Transition;
	type Value = unknown;
	type Meta = unknown;
</script>

<script
	lang="ts"
	generics="Value = unknown, Meta = unknown, 
	TransitionIn extends Transition = SlideTransition, TransitionOut extends Transition = SlideTransition"
>
	import { dynamicTransition } from '../stepper/transition';

	import {
		prefersReducedMotionStore,
		type AutocompleteOption,
		type Transition,
		type TransitionParams
	} from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	type Option = AutocompleteOption<Value, Meta>;

	const dispatch = createEventDispatcher<{ selection: Option }>();

	const filterOptions = (): Option[] => {
		return [...listedOptions].filter((option) => {
			const inputFormatted = String(input).toLowerCase().trim();

			let optionFormatted = JSON.stringify([
				option.label,
				option.value,
				option.keywords
			]).toLowerCase();

			if (optionFormatted.includes(inputFormatted)) return option;
		});
	};

	/** Bind the input value. */
	export let input: Value | undefined = undefined;

	/** Define values for the list. */
	export let options: Option[] = [];

	/** Limit the total number of suggestions. */
	export let limit: number | undefined = undefined;

	/** Provide allowlist values. */
	export let allowlist: Value[] = [];

	/** Provide denylist values. */
	export let denylist: Value[] = [];

	/** Provide arbitrary classes to nav element. */
	export let regionNav = '';

	/** Provide arbitrary classes to each list. */
	export let regionList = 'list-nav';

	/** Provide arbitrary classes to each list item. */
	export let regionItem = '';

	/** Provide arbitrary classes to each button. */
	export let regionButton = 'w-full';

	/** Provide arbitrary classes to empty message. */
	export let regionEmpty = 'text-center p-3';

	/** Provide a custom filter function. */
	export let filter: () => Option[] = filterOptions;

	/** Enable/Disable transitions */
	export let transitions = !$prefersReducedMotionStore;

	/** Provide the transition used on entry. */
	export let transitionIn: TransitionIn = slide as TransitionIn;

	/** Transition params provided to `transitionIn`. */
	export let transitionInParams: TransitionParams<TransitionIn> = { duration: 200 };

	/** Provide the transition used on exit. */
	export let transitionOut: TransitionOut = slide as TransitionOut;

	/** Transition params provided to `transitionOut`. */
	export let transitionOutParams: TransitionParams<TransitionOut> = { duration: 200 };

	// Local
	$: listedOptions = options;

	const filterByAllowDeny = (allowlist: Value[], denylist: Value[]) => {
		let _options = [...options];

		// Allowed Options
		if (allowlist.length) {
			_options = _options.filter((option) => allowlist.includes(option.value));
		}

		// Denied Options
		if (denylist.length) {
			_options = _options.filter((option) => !denylist.includes(option.value));
		}

		// Reset options
		if (!allowlist.length && !denylist.length) {
			_options = options;
		}

		listedOptions = _options;
	};

	// State
	$: filterByAllowDeny(allowlist, denylist);
	$: optionsFiltered = input ? filter() : listedOptions;
	$: sliceLimit = limit ?? optionsFiltered.length;

	// Reactive
	$: classesBase = `${$$props.class ?? ''}`;
	$: classesNav = `${regionNav}`;
	$: classesList = `${regionList}`;
	$: classesItem = `${regionItem}`;
	$: classesButton = `${regionButton}`;
	$: classesEmpty = `${regionEmpty}`;
</script>

<!--
@component
Basically the skeleton autocomplete component but with a slot for the options
-->
<div class="autocomplete {classesBase}" data-testid="autocomplete">
	{#if optionsFiltered.length > 0}
		<nav class="autocomplete-nav {classesNav}">
			<ul class="autocomplete-list {classesList}">
				{#each optionsFiltered.slice(0, sliceLimit) as option (option)}
					<li
						class="autocomplete-item {classesItem}"
						in:dynamicTransition|local={{
							transition: transitionIn,
							params: transitionInParams,
							enabled: transitions
						}}
						out:dynamicTransition|local={{
							transition: transitionOut,
							params: transitionOutParams,
							enabled: transitions
						}}
					>
						<button
							class="autocomplete-button {classesButton}"
							type="button"
							on:click={() => dispatch('selection', option)}
							on:click
							on:keypress
						>
							<slot name="option" {option}>
								{@html option.label}
							</slot>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	{:else}
		<div class="autocomplete-empty {classesEmpty}">
			<slot name="empty">No Results Found.</slot>
		</div>
	{/if}
</div>
