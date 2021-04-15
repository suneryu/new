<template>
    <qj-mini-invoice-info ref="invoiceInfo"></qj-mini-invoice-info>
</template>

<script>
export default {
  onShow() {
  	this.$refs.invoiceInfo.commonMounted(0)
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.$refs.invoiceInfo.loadMore();
  }
}
</script>

<style></style>




