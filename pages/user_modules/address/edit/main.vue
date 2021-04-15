<template>
	<qj-mini-user-address-edit ref="addressEdit"></qj-mini-user-address-edit>
</template>

<script>
export default {
	onLoad: function(options) {
		this.$refs.addressEdit.lifeOnLoad()
	}
};
</script>

<style></style>
