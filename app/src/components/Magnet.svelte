<script>
    let { text } = $props();

    let offsetX = (Math.random() - 0.5) * 5;
    let offsetY = (Math.random() - 0.5) * 5;
</script>

<div class="magnet" style="top: {offsetX}px; left: {offsetY}px">{text}</div>

<style>
    .magnet {
        display: inline-block;
        background: white;
        padding: 4px 7px;
        font-family: "Lucida Console";
        border-right: 3px solid
            light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
        border-bottom: 3px solid
            light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
        position: relative;
    }
</style>
