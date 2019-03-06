# 3d-light
Practice project: Draws, lights, and rotates a 3d sphere using Javascript ES5 and canvas.

I had to learn quite a bit for this project and made some mistakes along the way. It was very satisfying to get this one working!

Firstly to render the sphere on the screen I had to convert it to a 2d representation and remove all of the polygons that shouldn't be showing (the back-side of the sphere). This doesn't work exactly as it should, the method I used to cull (remove) polygons is a bit too aggressive and so some polygons which are nearly perpendicular to the camera sometimes disappear (especially with lower poly counts). I used quads instead of tris because it was easier for me to visualize. Although I would switch to tris next time because they seem to be easier to work with.

Secondly I screwed up on my vector algebra class. Get_length should be found using pythagorean's theorom. This is something that I fixed in other projects using an updated version of this class. Linear algebra had been the missing piece in a lot of my practice projects so it was great to finally learn some of it and implement it in a practical way. I'd never come across math in such a useful way before. I look forward to incorporating other maths into future projects!

Lastly I think there was probably a better way to instantiate a sphere than what I did. I had started working on a 3d Object class for a future version of this project, but stopped to learn some different concepts on another project.

All in all, it was a good chance to learn a ton of new skills and combine them in a meaningful way.
