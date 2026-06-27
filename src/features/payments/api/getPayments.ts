import { Payment } from "../types"

export async function getPayments(): Promise<Payment[]> {
  // Simular retardo de red
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  return [
    {
      id: "pay-1",
      amount: 1250.50,
      status: "success",
      email: "carlos.mendoza@rancho.com",
      createdAt: "2026-06-25T14:30:00Z",
    },
    {
      id: "pay-2",
      amount: 3400.00,
      status: "pending",
      email: "maria.gomez@agro.com",
      createdAt: "2026-06-24T09:15:00Z",
    },
    {
      id: "pay-3",
      amount: 450.25,
      status: "failed",
      email: "lucas.silva@vet.com",
      createdAt: "2026-06-23T18:45:00Z",
    },
    {
      id: "pay-4",
      amount: 890.00,
      status: "processing",
      email: "helena.perez@fms.com",
      createdAt: "2026-06-22T11:00:00Z",
    },
    {
      id: "pay-5",
      amount: 2300.00,
      status: "success",
      email: "roberto.diaz@ganaderia.com",
      createdAt: "2026-06-21T16:20:00Z",
    },
  ]
}
