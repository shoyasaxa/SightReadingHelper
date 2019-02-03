VF = Vex.Flow;
var div = document.getElementById("VexFlow");
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
renderer.resize(500, 500);
var context = renderer.getContext();
var tickContext = new VF.TickContext();

var stave = new VF.Stave(10, 10, 10000)
.addClef('treble');
stave.setContext(context).draw();

var durations = ['8', '4', '2', '1'];
// tickContext.preFormat().setX(400);

const visibleNoteGroups = [];

note_values = ['a','b','c','d','e','f','g']
accidental_values = ['', '#', 'b', 'bb',]
octaves = ['4','5']

document.getElementById('start-btn').addEventListener('click', (e) => {

  console.log("started");

	var renderVar = setInterval(function(){ 

	var letter = note_values[Math.floor(Math.random()*note_values.length)];
	var accidental = accidental_values[Math.floor(Math.random()*accidental_values.length)];
	var octave = octaves[Math.floor(Math.random()*octaves.length)];

 	var note = new VF.StaveNote({
 		clef: "treble", keys: [letter+accidental+'/'+octave], duration: "4" 
 	});
    console.log(note);
      
      if (accidental != "") {
      	note.addAccidental(0, new VF.Accidental(accidental))
      }

      note.setContext(context).setStave(stave);

      tickContext.addTickable(note)

	   tickContext.preFormat().setX(400);
	// note = notes.shift();
	// if(!note) return;
  const group = context.openGroup();
  visibleNoteGroups.push(group);
	note.draw();
  context.closeGroup();
	group.classList.add('scroll');
	// Force a dom-refresh by asking for the group's bounding box. Why? Most
  // modern browsers are smart enough to realize that adding .scroll class
  // hasn't changed anything about the rendering, so they wait to apply it
  // at the next dom refresh, when they can apply any other changes at the
  // same time for optimization. However, if we allow that to happen,
  // then sometimes the note will immediately jump to its fully transformed
  // position -- because the transform will be applied before the class with
  // its transition rule. 
  const box = group.getBoundingClientRect();
	group.classList.add('scrolling');

	// If a user doesn't answer in time make the note fall below the staff
	window.setTimeout(() => {
		const index = visibleNoteGroups.indexOf(group);
		if(index === -1) return;
		group.classList.add('too-slow');
    visibleNoteGroups.shift();
	}, 5000); // 5000 is the time 


  document.getElementById('stop-game').addEventListener('click', (e) => {
      clearInterval(renderVar);
  });



  $("#choices :input").change(function() {
    clearInterval(renderVar);

    $("#VexFlow").empty();


    VF = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "boo".
    var div = document.getElementById("VexFlow");
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);

    var context = renderer.getContext();

    var tickContext = new VF.TickContext();
    var stave = new VF.Stave(10, 10, 10000).addClef('bass');  
    stave.setContext(context).draw();
  });


	}, 2000);

});

// If a user plays/identifies the note in time, send it up to note heaven.
document.getElementById('right-answer').addEventListener('click', (e) => {
	group = visibleNoteGroups.shift();
  group.classList.add('correct');
	// The note will be somewhere in the middle of its move to the left -- by
  // getting its computed style we find its x-position, freeze it there, and
  // then send it straight up to note heaven with no horizontal motion.
	const transformMatrix = window.getComputedStyle(group).transform;
  // transformMatrix will be something like 'matrix(1, 0, 0, 1, -118, 0)'
  // where, since we're only translating in x, the 4th property will be
  // the current x-translation. You can dive into the gory details of
  // CSS3 transform matrices (along with matrix multiplication) if you want
  // at http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
	const x = transformMatrix.split(',')[4].trim();
	// And, finally, we set the note's style.transform property to send it skyward.
	group.style.transform = `translate(${x}px, -800px)`;
})
