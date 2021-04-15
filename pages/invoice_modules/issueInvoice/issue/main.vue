<template>
  <qj-mini-invoice-issue ref="invoiceIssue"></qj-mini-invoice-issue>
</template>

<script>
export default {
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.$refs.invoiceIssue.loadMore();
  }
};
</script>
<style></style>




