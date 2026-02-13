import Cards from "@/components/home/Cards";
import Cta from "@/components/home/Cta";
import Hero from "@/components/home/Hero";

export default async function Home() {

  // const result = await new Promise((res) => {
  //   setTimeout(()=>{
  //     res("intentional delay");
  //   }, 2000)
  // })


  return (
    <>
    <Hero/>  
    <Cards/>

    </>
  );
}
