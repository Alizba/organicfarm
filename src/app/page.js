import Cards from "@/components/home/Cards";
import Cta from "@/components/home/Cta";
import Hero from "@/components/home/Hero";
import Category from "@/components/home/category/Category";
import Offers from "@/components/home/Offers";
import Product from "@/components/home/products/Product";
import Knowledge from "@/components/home/Knowledge";
import { Deal } from "@/components/home/deals/Deal";
import Data from "@/components/home/Data";
import TopSelling from "@/components/home/TopSelling";
import Partners from "@/components/home/Partners";
import Testimonal from "@/components/home/Testimonal";
import Contact from "@/components/home/Contact";

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
    <Cta/>
    <Category/>
    <Offers/>
    <Product/>
    <Knowledge/>
    <Deal/>
    <Data/>
    <TopSelling/>
    <Partners/>
    <Testimonal/>
    <Contact/>
    </>
  );
}
