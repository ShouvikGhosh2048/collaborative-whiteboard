export default function SaveButton() {
    return (
        <a onClick={e => {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#using_the_download_attribute_to_save_a_canvas_as_a_png
            e.stopPropagation();
            (e.target! as HTMLAnchorElement).href = document.querySelector("canvas")!.toDataURL();
        }} className="btn btn-success" download="image.png">Save</a>
    );
}