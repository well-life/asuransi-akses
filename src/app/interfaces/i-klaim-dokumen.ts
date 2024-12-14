export interface IKlaimDokumen {
    id: string;  // Unique identifier for the document
    idMasterDoc: {  // Master document information
      id: number;  // ID of the master document
      jenisDokumen: string;  // Type of the document (e.g., 'KTP', 'Surat Kematian')
    };
    directory: string;  // Directory or file path where the document is stored
}