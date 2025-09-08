import React from 'react';
import Status from './Status';
import { BiDotsVerticalRounded } from "react-icons/bi";

type Props = {
  title: string;
  name: string;
  email: string;
  employeeNumber: string;
  date: string;
  imageUrl?: string;
  badgeText: string;
  action?: () => void;
};

const CardUser: React.FC<Props> = ({
  title,
  name,
  email,
  employeeNumber,
  date,
  imageUrl,
  badgeText,
  action
}) => {
  return (
    <article className='w-full h-full bg-white rounded-[8px] px-5 py-4 space-y-6 shadow-md'>
      <div className='flex flex-row items-center justify-between'>
        <h3 className=' text-[14px] md:text-[16px] font-semibold text-black'>{title}</h3>
        <div className='flex flex-row items-center gap-x-2'>
          <Status  />
          
        </div>
      </div>

      <div className='flex flex-row items-center gap-3'>
        <div className='w-11 h-11 rounded-full overflow-hidden bg-black'>
          {imageUrl ? (
            <img className='w-full h-full object-cover' src={imageUrl} alt='User' />
          ) : null}
        </div>
        <div className='flex flex-col'>
          <h2 className='text-[14px] md:text-[16px] font-semibold text-black'>{name}</h2>
          <p className='text-[10px] md:text-[13px] font-normal text-[#565656]'>{email}</p>
        </div>
      </div>

      <div className='flex flex-row items-center gap-14'>
        <div>
          <p className='text-[10px] text-[#565656] font-normal'>Núm. de empleado</p>
          <h2 className=' text-[13px] md:text-[15px] text-[#2F2F2F] font-medium'>{employeeNumber}</h2>
        </div>

        <div>
          <p className='text-[10px] text-[#565656] font-normal'>Fecha</p>
          <h2 className='text-[13px] md:text-[15px] text-[#2F2F2F] font-medium'>{date}</h2>
        </div>
      </div>

      <div className='flex flex-row items-center justify-between'>
        <div className='flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#E3E5FE] border border-[#A0A7FC]'>
          <p className='text-[10px] font-bold text-[#A0A7FC]'>{badgeText}</p>
        </div>

        <button onClick={action}>
            <BiDotsVerticalRounded size={24} className='cursor-pointer text-[#6A6A6A]' />
          </button>
      </div>
    </article>
  );
};

export default CardUser;
