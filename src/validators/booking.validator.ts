import {z } from "zod";
export const createBookingSchema = z.object({
    userId:z.number({message:"userId must be  present"}),
    hotelId:z.number({message:"hotelId must be  present"}),
    totalGuests:z.number({message:"totalGuests must be present"}).min(1,{message:"totalGuests must be at least 1"}),
    bookingAmount:z.number({message:"bookingAmount must be present"}).min(1,{message:"bookingAmount must be at least 1"}), 
})