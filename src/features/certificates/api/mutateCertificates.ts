import { api } from "@/lib/api";
import { Certificate, CertificateFormData } from "../types";

export async function createCertificate(formData: CertificateFormData): Promise<Certificate> {
  const payload = new FormData();
  payload.append("certificate_number", formData.certificate_number);
  payload.append("issue_date", formData.issue_date);
  if (formData.expiry_date) {
    payload.append("expiry_date", formData.expiry_date);
  }
  payload.append("assign_by", formData.assign_by);

  if (formData.batch_id) {
    payload.append("batch_id", String(formData.batch_id));
  }

  if (formData.livestock_ids && formData.livestock_ids.length > 0) {
    formData.livestock_ids.forEach((id) => {
      payload.append("livestock_ids[]", String(id));
    });
  }

  if (formData.file) {
    payload.append("file", formData.file);
  }

  const { data } = await api.post<{ data: Certificate }>("/certificates", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
}

export async function updateCertificate(
  id: string | number,
  formData: any
): Promise<Certificate> {
  if (formData instanceof FormData) {
    const { data } = await api.post<{ data: Certificate }>(`/certificates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  }
  const { data } = await api.put<{ data: Certificate }>(`/certificates/${id}`, formData);
  return data.data;
}

export async function deleteCertificate(id: string | number): Promise<void> {
  await api.delete(`/certificates/${id}`);
}
