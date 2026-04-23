import driver1 from "@/assets/driver-1.jpg";
import driver2 from "@/assets/driver-2.jpg";
import driver3 from "@/assets/driver-3.jpg";
import driver4 from "@/assets/driver-4.jpg";
import driver5 from "@/assets/driver-5.jpg";
import docLicense from "@/assets/doc-license.jpg";
import docRc from "@/assets/doc-rc.jpg";
import docId from "@/assets/doc-id.jpg";

export type VehicleType = "Electric" | "Petrol" | "CNG";
export type DriverStatus = "approved" | "pending" | "disabled";

export interface Driver {
  id: string;
  name: string;
  photo: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  registrationDate: string;
  approvalDate?: string;
  status: DriverStatus;
  phone: string;
  rating?: number;
  trips?: number;
  documents: {
    license: string;
    rc: string;
    id: string;
  };
}

const docs = { license: docLicense, rc: docRc, id: docId };

export const drivers: Driver[] = [
  {
    id: "1042",
    name: "Rahul Mehta",
    photo: driver1,
    vehicleNumber: "MH 8C AT 7421",
    vehicleType: "Electric",
    registrationDate: "12 Mar 2024",
    approvalDate: "18 Mar 2024",
    status: "approved",
    phone: "+91 98102 11234",
    trips: 1284,
    documents: docs,
  },
  {
    id: "1043",
    name: "Imran Sheikh",
    photo: driver2,
    vehicleNumber: "MH 02 BX 9912",
    vehicleType: "CNG",
    registrationDate: "04 Apr 2024",
    approvalDate: "09 Apr 2024",
    status: "approved",
    phone: "+91 99876 54210",
    rating: 4.6,
    trips: 962,
    documents: docs,
  },
  {
    id: "1044",
    name: "Aakash Verma",
    photo: driver3,
    vehicleNumber: "MH 05 MQ 4410",
    vehicleType: "Petrol",
    registrationDate: "21 Apr 2024",
    approvalDate: "27 Apr 2024",
    status: "approved",
    phone: "+91 90011 22334",
    rating: 4.9,
    trips: 1741,
    documents: docs,
  },
  {
    id: "1045",
    name: "Suresh Kumar",
    photo: driver4,
    vehicleNumber: "MH 09 PR 0021",
    vehicleType: "CNG",
    registrationDate: "30 May 2024",
    approvalDate: "03 Jun 2024",
    status: "approved",
    phone: "+91 88555 66778",
    rating: 4.7,
    trips: 2108,
    documents: docs,
  },
  {
    id: "1046",
    name: "Priya Nair",
    photo: driver5,
    vehicleNumber: "MH 07 TZ 5512",
    vehicleType: "Electric",
    registrationDate: "11 Jun 2024",
    approvalDate: "15 Jun 2024",
    status: "approved",
    phone: "+91 70011 99887",
    rating: 4.95,
    trips: 612,
    documents: docs,
  },
  {
    id: "1051",
    name: "Vikram Singh",
    photo: driver2,
    vehicleNumber: "MH 14 KQ 8821",
    vehicleType: "Petrol",
    registrationDate: "02 Sep 2024",
    status: "pending",
    phone: "+91 98123 76540",
    documents: docs,
  },
  {
    id: "1052",
    name: "Manoj Pillai",
    photo: driver3,
    vehicleNumber: "MH 11 AC 3344",
    vehicleType: "Electric",
    registrationDate: "18 Sep 2024",
    status: "pending",
    phone: "+91 90876 12345",
    documents: docs,
  },
  {
    id: "1053",
    name: "Deepa Joshi",
    photo: driver5,
    vehicleNumber: "MH 01 EE 7710",
    vehicleType: "CNG",
    registrationDate: "29 Sep 2024",
    status: "pending",
    phone: "+91 99765 43321",
    documents: docs,
  },
];

export const stats = {
  activeDrivers: 248,
  inactiveDrivers: 37,
  registered: 312,
  pending: 3,
  tripsCompleted: 18742,
  revenueK: 412,
};
