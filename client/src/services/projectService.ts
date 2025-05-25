
/**
 * Types
*/
import type { ApiResponse } from '@/types/api';
import type { Project } from '@/types/project';

/**
 * Utils
 */
import API from '@/utils/axios';

export const projectService = {
  async getProjects() {
    const response = await API.get<ApiResponse<Project[]>>('/project');
    return response.data.data;
  },
};
