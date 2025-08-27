import React, { useContext, useState } from 'react'
import Sidebar from './sidebar';
import { FaPlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { apiContext } from './apicontext';
import { RiGeminiFill } from "react-icons/ri";

;

const Body = () => {

    const { handleApi, loading, question, setQuestion, result } = useContext(apiContext);



    const handleClick = () => {
        handleApi(question);
        setQuestion("");
    }



    return (
        <div className='flex h-[100vh] w-[100%] overflow-hidden  relative'>
            <Sidebar />
            <div className='w-[100vw] h-full bg-[#0e0e0f] flex flex-col'>
                <div className='flex justify-between px-6 py-4 h-[70px]  '>
                    <p className='text-xl text-gray-400 font-bold'>Gemini</p>
                    <button className='bg-blue-300  px-6 rounded-lg mr-4'>Sign In</button>
                </div>
                <div className='flex flex-col justify-center items-center mt-2 '>

                    <div className=' w-[280px] sm:w-[500px] text-[12px] md:text-[18px] h-[75vh] mt-5 md:w-[650px] lg:w-[850px] rounded-lg text-white md:font-semibold overflow-y-auto hide-scrollbar  flex  gap-3 '>


                        <div className='flex flex-col w-full'>
                            {result.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div

                                        className={`max-w-[100%] px-2 lg:px-8 md:px-6 py-2 rounded-b-3xl rounded-l-3xl m-5 ${item.type === 'q'
                                            ? 'self-end text-right bg-gray-500'
                                            : 'self-start text-left '
                                            }`}
                                    >


                                        {item.type === 'q' ? (
                                            <p>{item.text}</p>
                                        ) : (
                                            <div className='flex gap-x-5 '>
                                                <RiGeminiFill className='text-blue-400 w-6 h-6 ' />
                                                {loading && index === result.length - 1 && <div className='self-start text-left text-[12px] md:text-[18px] text-white px-8 py-2'>
                                                    Just a sec..
                                                </div>}
                                                <div dangerouslySetInnerHTML={{ __html: item.text }}
                                                    className="text-gray-200" />
                                            </div>
                                        )}
                                    </div>
                                </React.Fragment>

                            ))}

                            {/* {loading && (
                                <div className='self-start text-left px-2 lg:px-8 md:px-6 py-2 rounded-b-3xl rounded-l-3xl m-5 text-white bg-[#1e1e20]'>


                                    <div className="text-gray-200">
                                        {formattedAnswer}
                                    </div>

                                </div>
                            )} */}

                        </div>

                    </div>
                    <div className='relative'>
                        <input type='text' className='h-[40px] w-[250px] md:h-[50px] lg:h-[55px] my-3 sm:w-[500px] md:w-[620px] lg:w-[800px] border-[1px] bg-[#0e0e0f] rounded-full border-gray-700 text-white outline-none  text-center '
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)} />

                        <FaPlus className='h-4 w-4 top-6 md:top-6 lg:top-6 left-5 text-gray-400 absolute md:h-8 md:w-8' />
                        <IoSend className='top-4 h-7 w-7 p-1  md:top-4 lg:top-5 right-3 text-white absolute md:h-10 md:w-10 bg-gray-800 rounded-full md:p-2' onClick={handleClick} />
                    </div>
                </div>
            </div>
        </div >
    )
    // bg-[#0e0e0f]
}

export default Body