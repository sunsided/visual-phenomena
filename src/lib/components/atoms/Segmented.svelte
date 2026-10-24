<script lang="ts" generics="T extends string">
	interface Props {
		label: string;
		options: { value: T; label: string }[];
		value: T;
	}

	let { label, options, value = $bindable() }: Props = $props();
</script>

<fieldset class="segmented">
	<legend>{label}</legend>
	<div class="options">
		{#each options as option (option.value)}
			<label class={{ active: option.value === value }}>
				<input type="radio" bind:group={value} value={option.value} />
				{option.label}
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.segmented {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 0.875rem;
	}

	legend {
		padding: 0;
		margin-bottom: var(--space-1);
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	label {
		flex: 1;
		padding: var(--space-1) var(--space-3);
		text-align: center;
		cursor: pointer;
		white-space: nowrap;
	}

	label + label {
		border-left: 1px solid var(--color-border);
	}

	label.active {
		background: var(--color-accent);
		color: white;
	}

	label:has(:focus-visible) {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
</style>
