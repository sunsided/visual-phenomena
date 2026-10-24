<script lang="ts">
	interface Props {
		label: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		unit?: string;
	}

	let { label, value = $bindable(), min = 0, max = 100, step = 1, unit = '' }: Props = $props();
</script>

<label class="slider">
	<span class="head">
		<span>{label}</span>
		<output>{value}{unit}</output>
	</span>
	<input type="range" bind:value {min} {max} {step} />
</label>

<style>
	.slider {
		display: grid;
		gap: var(--space-1);
		font-size: 0.875rem;
	}

	.head {
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
	}

	output {
		font-family: var(--font-mono);
		color: var(--color-muted);
	}

	input {
		width: 100%;
		accent-color: var(--color-accent);
	}
</style>
