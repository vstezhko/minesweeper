export let timer;

export const gameTime = () => {
  const clock = document.querySelector('.clock')
  let time = 0

   timer = setInterval(()=>{
    time += 1;
    clock.innerHTML = time;
  }, 1000)
}