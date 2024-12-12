import React from 'react';

// interface Template {
//   id: string;
//   name: string;
//   created_at: string;
//   task_groups: any[];
// }

const TaskPage: React.FC = () => {
//   const [showTaskForm, setShowTaskForm] = useState(false);
//   const [showTemplateForm, setShowTemplateForm] = useState(false);
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

//   const handleTemplateCreate = (newTemplate: Template) => {
//     setTemplates([...templates, newTemplate]);
//     setShowTemplateForm(false);
//   };

//   const handleTemplateSelect = (template: Template) => {
//     setSelectedTemplate(template);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <Button 
//             type="primary"
//             ghost
//             onClick={() => setShowTaskForm(true)}
//           >
//             Создать задачу
//           </Button>
//         </div>

//         {showTaskForm && (
//           <CreateTaskForm 
//             onCreateTemplate={() => setShowTemplateForm(true)}
//             templates={templates}
//             onTemplateSelect={handleTemplateSelect}
//             selectedTemplate={selectedTemplate}
//           />
//         )}

//         {showTemplateForm && (
//           <CreateTemplateForm 
//             onSave={handleTemplateCreate}
//             onCancel={() => setShowTemplateForm(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
let text = <div>Task</div>
return text
};

export default TaskPage;
