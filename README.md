# TabThumbNailOverlay
firefox addon, which puts small thumbnails of the tab content into the tab ui 


![GitHub Logo](screenShot.png)

primarily its meant as an extension to "tree style tabs" the legacy version ...

i now made it compatible with sessionmanager and normal session-restore .. 
i hooked the Sessionstore.jsm so it should even be compatible with webext session managers 

-limitations :

it will only work completely with e10s(mutliprocessing / remote tabs) , i dont want to build in fixes for noremote 

---

the idea came from the an old addon "informational tabs" , but that thing was seriously bloated.

so i rewrote the functionality i needed (tab thumbnails) into an efficient addon which uses salmost no ressources and doesnt mess with firefox too much 
