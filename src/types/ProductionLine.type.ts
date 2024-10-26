export type ProductionLineType = {
    additional_fields: { machine_counts: number | null ,image_name: string | null} | null;
    code: string | null;
    created_at: string | null;
    deleted_at: string | null;
    id: number | null;
    name_english: string | null;
    name_persian: string | null;
    updated_at: string | null;
  };
  

  export interface MachineType {
    additional_fields: { image_name: string | null} | null;
    brand: string | null;
    department_name: string | null;
    is_machine: boolean | null;
    machine_subtype: string | null;
    machine_subtype_id: number | null;
    machine_type: string | null;
    made_on: string | null;
    name: string | null;
    unchanged_fields: Record<string, any> | null;  // Assuming it's a dynamic object, otherwise specify the structure
  }
  
  export type MessagesType =  {
    created_at: string;          // e.g., "Mon, 19 Aug 2024 14:36:10 GMT"
    entity_id: string;           // e.g., "sss"
    entity_type: string;         // e.g., "machine"
    id: string;                  // Unique ID for this entry
    message_type: string;        // e.g., "PM" for Preventive Maintenance
    seen: number;                // 1 for seen, 0 for unseen
    summary: string;             // Summary of the message, e.g., "AAA"
    time: string;                // Same as created_at, time of the log entry
    title: string;               // Title of the message, e.g., "AAA"
    updated_at: string;          // Last updated time, same format as created_at
}
