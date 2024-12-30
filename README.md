# Optimus World

## Description
Here is a 3D Experience done with React, Three JS, react-three-fiber and Drei. This portofilio is a fun one inspired by Bruno Simon the famous one portfolio https://bruno-simon.com/

## ⚠ Warning ⚠
I'm not a 3d artist. I'v taken all the 3d from differents sources. They are all in the credit section. Thx to them, unless this project would be impossible. Also huge credit for Isaac Mason repository for the car physics.

## How to run this project
This project is a react project so simply run this 2 commands and you are ready to go
```cmd
npm install
```
```cmd
npm start
```
This project also i'v been done with project idx of google so you can just import it and run it from there.

### With docker
```cmd
docker build --tag 'optimus-world' .
```
```cmd
docker run -p 3000:3000 optimus-world
```

## To Do List 

- Vehicule Physic
  - [ ] Add the ability to siwtch camera (interior exterior)
  - [ ] Upgrade gesture of camera, especially when close to walls
  - [ ] Adjust speed and speed indicator based on cybertruck physics
- Environement
  - [ ] add water everywhere
  - [ ] modify island for lilte shortcut like in the volcano
  - [ ] added day and night switch (this feature include light of the city during day and night / stars and sun in the sky)
  - [ ] better gesture of colisions with island, need a mapping for each wall and water
  - [x] remove glitches from the map
- Gameplay 
  - [ ] add reset button for the car
  - [ ] add a github link and a linkedin link
  - [ ] add loading screen
  - [ ] create a controller for mobile for the car
  - [ ] make the website responsive and mobile friendly


### Bonus fun features to implement.
- [ ] add a movie theatre with a video
- [ ] add a firefowrk show and with drone show
- [ ] add a space x landing vehicule
- [ ] add a race in the island with a highscore
- [ ] add chill music with a mute button
- [ ] add litle fun things that i like and sections in the island about me


## Credits

Car Physic :
https://github.com/isaac-mason/sketches

credit to websites :
https://market.pmnd.rs/

3D Marketplace :
https://market.pmnd.rs/

HDRI
https://polyhaven.com/a/kiara_1_dawn

Water :
 https://github.com/nhtoby311/WaterSurface?tab=readme-ov-file
