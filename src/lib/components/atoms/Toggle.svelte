<script lang="ts">
	interface Props {
		label: string;
		checked: boolean;
	}

	let { label, checked = $bindable() }: Props = $props();
</script>

<label class="toggle">
	<input type="checkbox" role="switch" bind:checked />
	<span>{label}</span>
</label>

<style>
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 0.875rem;
		cursor: pointer;
	}

	input {
		width: 1.1rem;
		height: 1.1rem;
		margin: 0;
		accent-color: var(--color-accent);
	}
</style>
