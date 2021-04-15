<template>
    <qj-mini-evaluate-my-comment ref='myComment'></qj-mini-evaluate-my-comment>
</template>

<script>
export default {
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.$refs.myComment.loadMore();
  }
}
</script>

<style></style>




