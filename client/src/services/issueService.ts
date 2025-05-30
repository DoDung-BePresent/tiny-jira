/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { Issue, UpdateIssuePayload } from '@/types/issue';

/**
 * Utils
 */
import API from '@/utils/axios';

export const issueService = {
  async updateIssue({ issueId, data }: UpdateIssuePayload) {
    const response = await API.put<ApiResponse<Issue>>(
      `/issue/${issueId}`,
      data,
    );
    return response.data.data;
  },
};
