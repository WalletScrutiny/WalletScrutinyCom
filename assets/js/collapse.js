$(".header").click(() => {
    $header = $(this)
    //getting the next element
    $content = $header.next()
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, () => {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        $header.text(() => {
            //change text based on condition
            return $content.is(":visible") ? "Collapse" : "Expand"
        })
    })
})
