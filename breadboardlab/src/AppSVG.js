import interact from "interactjs";

window.addEventListener('load', () => {
	interact(".part-container").draggable({
		manualStart: true,
		listeners: {
			move(event) {
				dragMoveListener(event);
			}
		}
	}).on("move", function(event) {
		const { currentTarget, interaction } = event;
		let element = currentTarget.querySelector(".part");
	
		if (interaction.pointerIsDown && !interaction.interacting() && currentTarget.style.transform === "") {
			element = currentTarget.querySelector(".part").cloneNode(true) || currentTarget.cloneNode(true);
			
			element.offsetLeft = currentTarget.offsetLeft;
			element.offsetTop = currentTarget.offsetTop;
			
			document.getElementById("AppSVG").appendChild(element);
		}
		interaction.start({ name: "drag" }, event.interactable, element);
	})

	interact(".part").draggable({
		listeners: {
			move(event) {
				dragMoveListener(event);
			}
		}
	});
});


function dragMoveListener (event) {
	const regex = /translate\(([\d]+)px, ([\d]+)px\)/i;
	const transform = regex.exec(event.target.style.transform);

	if (transform && transform.length > 1) {
		event.target.style.transform = `translate(${Number(transform[1]) + event.dx}px, ${Number(transform[2]) + event.dy}px)`;
	} else {
		event.target.style.transform = `translate(${event.dx + event.currentTarget.offsetLeft}px, ${event.dy + event.currentTarget.offsetTop}px)`;
	}
}
