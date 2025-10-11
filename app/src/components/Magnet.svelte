<script>
    let { text, position } = $props();

    let offsetX = position ? position.x : (Math.random() - 0.5) * 5;
    let offsetY = position ? position.y : (Math.random() - 0.5) * 5;
</script>

<div
    class="magnet {position ? 'abs' : ''}"
    style="top: {offsetX}px; left: {offsetY}px"
>
    {text}
</div>

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
        cursor: default;
    }

    .magnet.abs {
        position: absolute;
    }
</style>
