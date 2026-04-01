import { IRiderProfile, IUser } from "./user";

export type DeliveryStatus = "PENDING" | "RIDER_ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";
export type ParcelCategory = "PARCEL" | "CARGO";





export interface ITrackingStep {
  id: string;
  trackingId: string;
  status: "PENDING" | "RIDER_ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  message: string;
  location?: string | null;
  timestamp: string; // ISO Date string
}

export interface ITracking {
  id: string;
  parcelId: string;
  status: string;
  steps: ITrackingStep[]; 
}

export interface IParcel {
  id: string;
  trackingCode: string;
  senderId: string;
  riderId: string | null;
  title: string;
  category: "PARCEL" | "CARGO";
  weight: number;
  price: string | number;
  pickupAddress: string;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  deliveryStatus: "PENDING" | "RIDER_ASSIGNED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
  updatedAt: string;
  
  tracking?: ITracking; 
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IParcelResponse {
  success: boolean;
  message: string;
  meta: IMeta;
  data: IParcel[];
}

export interface IPaymentHistoryItem {
  id: string;
  parcelId: string;
  amount: string | number;
  currency?: string;
  status?: string;
  transactionId?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
  parcel?: {
    title?: string;
    trackingCode?: string;
  } | null;
}

export interface IPaymentHistoryResponse {
  success: boolean;
  message: string;
  data: IPaymentHistoryItem[];
}

export interface IDetailedTrackingStep {
  id: string;
  trackingId: string;
  status: string;
  location: string | null;
  message: string | null;
  timestamp: string; // ISO Date String
}

export interface IDetailedTracking {
  id: string;
  parcelId: string;
  status: string;
  steps: IDetailedTrackingStep[];
}


export interface IParcelTrackingDetail {
  id: string;
  trackingCode: string;
  title: string;
  deliveryStatus: string;
  paymentStatus: string;
  price: string | number;
  pickupAddress: string;
  deliveryAddress: string;
  receiverName: string;
  receiverPhone: string;
  createdAt: string;
  

  sender: {
    name: string;
  };
  rider: {
    user: {
      name: string;
      image: string | null;
    };
  } | null;
  tracking: IDetailedTracking | null;
}


export interface ITrackActionResponse {
  success: boolean;
  message: string;
  data: IParcelTrackingDetail;
}