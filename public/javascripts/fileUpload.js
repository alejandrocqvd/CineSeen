const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--movie-poster-width-large') != null 
&& rootStyles.getPropertyValue('--movie-poster-width-large') !== '') {
    ready()
} else {
    document.getElementById('main-css')
    .addEventListener('load', ready)
}

function ready() {
    const posterWidth = parseFloat(rootStyles.getPropertyValue('--movie-poster-width-large'))
    const posterAspectRatio = parseFloat(rootStyles.getPropertyValue('--movie-poster-aspect-ratio'))
    const posterHeight = posterWidth / posterAspectRatio

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / posterAspectRatio,
        imageResizeTargetWidth: posterWidth,
        imageResizeTargetHeight: posterHeight,
    })
    
    FilePond.parse(document.body);
}