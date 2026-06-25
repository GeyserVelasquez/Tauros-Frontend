"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api";
import {useState} from "react";

type LaravelType = {
    Laravel:string;
}
export default function Home() {
    // Si esto NO te marca error en rojo, TypeScript está apagado o muy permisivo
    const x: number = 1;
    const [laravel,setLaravel] = useState<LaravelType | null>();
    const laravelHandle = async () => {
        const { data } = await api.get("/", {baseURL: process.env.NEXT_PUBLIC_SERVER_URL});
        setLaravel(data);
    }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Button onClick={laravelHandle}>{ laravel ? laravel.Laravel : "Click"}</Button>
      </main>
    </div>
  );
}
