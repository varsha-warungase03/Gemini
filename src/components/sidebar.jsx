import React, { useContext, useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import { MdOutlineSubscriptions } from "react-icons/md";
import { PiBagBold } from "react-icons/pi";
import { IoIosSettings } from "react-icons/io";
import { apiContext } from './apicontext';
import { TiMessage } from "react-icons/ti";
import { MdClear } from "react-icons/md";

const Sidebar = () => {

    const { prevprompt, setPrevprompt, handleApi, setQuestion, setRecentprompt } = useContext(apiContext);
    const [close, setClose] = useState(prevprompt);

    const loadPrompt = async (prompt) => {
        setRecentprompt(prompt);
        await handleApi(prompt, "history");

        setQuestion("");
    }

    // const removeitem = (id) => {
    //     setClose(close.filter((_, index) => index !== id));
    // }

    const handleRemovePrompt = (e, index) => {
        // Remove prompt at specific index
        e.stopPropagation();
        const updatedPrompts = prevprompt.filter((_, i) => i !== index);
        setPrevprompt(updatedPrompts);
    }


    return (
        <div>
            <div >
                <div className='bg-[#282a2c] text-gray-400  h-[100vh] md:w-[17vw] flex flex-col w-[10vw]'>
                    <div className=' md:flex  md:justify-between  p-4'>
                        <IoMenu className="w-5 h-5 my-2" />
                        <IoSearch className="w-5 h-5 my-2" />
                    </div>
                    <div className='flex md:gap-x-3 justify-start items-center md:px-5 lg:px-10 mt-10 '>
                        <FaEdit className="w-5 h-5" />
                        <p className='hidden md:block md:text-[15px]'>New Chat</p>
                    </div>
                    <div className='flex flex-col  justify-start items-center w-full px-4 mt-10 h-[50%] '>
                        <p className=' md:font-bold hidden  md:block'>Recent</p>

                        <div className='hide-scrollbar overflow-y-auto md:w-full hidden md:block'>
                            {prevprompt.map((item, index) => {
                                return (
                                    <div key={index} className='flex gap-x-3 mt-2  h-8 border-[1px] border-gray-600 rounded-lg w-full justify-between over flow-x-auto items-center px-2' onClick={() => loadPrompt(item)}>
                                        <TiMessage className='w-5 h-5' />

                                        <p className="hidden lg:block text-[17px]">
                                            {item.slice(0, 10)}.....
                                        </p>
                                        <p className="hidden md:block lg:hidden text-[15px]">
                                            {item.slice(0, 5)}...
                                        </p>

                                        <p className="block md:hidden text-[15px]">
                                            {item.slice(0, 5)}...
                                        </p>
                                        <MdClear className='w-5 h-5 ' onClick={(e) => handleRemovePrompt(e, index)} />
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <div className='flex flex-col md:pl-5 lg:pl-5 mt-4 md:justify-center md:items-start'>
                        <div className='flex lg:gap-x-3 md:gap-x-2 m-2 '>
                            <RiGeminiFill className='w-5 h-5' />
                            <p className='hidden md:block'>Gemini App</p>
                        </div>
                        <div className='flex lg:gap-x-3 md:gap-x-2 m-2'>
                            <MdOutlineSubscriptions className='w-5 h-5' />
                            <p className='hidden md:block'>Subscriptions</p>
                        </div>
                        <div className='flex lg:gap-x-3 md:gap-x-2 m-2'>
                            <PiBagBold className='w-5 h-5' />
                            <p className='hidden md:block'>For Bussiness</p>
                        </div>
                        <div className='flex lg:gap-x-3 md:gap-x-2  m-2'>
                            <IoIosSettings className='w-5 h-5' />
                            <p className='hidden md:block'>Settings</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Sidebar