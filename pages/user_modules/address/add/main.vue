<template>
	<qj-mini-user-address-add ref="addressAdd"></qj-mini-user-address-add>
</template>

<script>
export default {
	onLoad() {
		this.$refs.addressAdd.lifeOnLoad()
	}
};
</script>

<style></style>