// src/utils/validate.js

function validatePostCreate(body) {
  const value = { ...body }; // Copy input
  const details = {};

  // Validate title
  if (!value.title || typeof value.title !== 'string' || value.title.trim().length < 3) {
    details.title = 'Title is required and must be at least 3 characters long';
  } else {
    value.title = value.title.trim(); // Clean it
  }

  // Validate content
  if (!value.content || typeof value.content !== 'string' || value.content.trim().length < 10) {
    details.content = 'Content is required and must be at least 10 characters long';
  } else {
    value.content = value.content.trim();
  }

  // Validate author
  if (!value.author || typeof value.author !== 'string' || value.author.trim().length < 2) {
    details.author = 'Author is required and must be at least 2 characters long';
  } else {
    value.author = value.author.trim();
  }

  // Validate tags (optional, but must be valid if present)
  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags)) {
      details.tags = 'Tags must be an array of strings';
    } else if (value.tags.length > 20) {
      details.tags = 'Tags cannot exceed 20 items';
    } else {
      const invalidTag = value.tags.some(tag => 
        typeof tag !== 'string' || tag.trim() === ''
      );
      if (invalidTag) {
        details.tags = 'All tags must be non-empty strings';
      } else {
        // Clean tags
        value.tags = value.tags.map(tag => tag.trim());
      }
    }
  } else {
    // Default to empty array if not provided
    value.tags = [];
  }

  // If any errors
  if (Object.keys(details).length > 0) {
    return {
      value: null,
      error: {
        message: 'Validation failed',
        details
      }
    };
  }

  // Success
  return { value, error: null };
}








function validatePostUpdate(body) {
  const value = { ...body };
  const details = {};

  // All fields are optional in update
  // But if provided, they must be valid

  if (value.title !== undefined) {
    if (typeof value.title !== 'string' || value.title.trim().length < 3) {
      details.title = 'Title must be at least 3 characters long';
    } else {
      value.title = value.title.trim();
    }
  }

  if (value.content !== undefined) {
    if (typeof value.content !== 'string' || value.content.trim().length < 10) {
      details.content = 'Content must be at least 10 characters long';
    } else {
      value.content = value.content.trim();
    }
  }

  if (value.author !== undefined) {
    if (typeof value.author !== 'string' || value.author.trim().length < 2) {
      details.author = 'Author must be at least 2 characters long';
    } else {
      value.author = value.author.trim();
    }
  }

  if (value.tags !== undefined) {
    if (!Array.isArray(value.tags)) {
      details.tags = 'Tags must be an array of strings';
    } else if (value.tags.length > 20) {
      details.tags = 'Tags cannot exceed 20 items';
    } else {
      const invalidTag = value.tags.some(tag => 
        typeof tag !== 'string' || tag.trim() === ''
      );
      if (invalidTag) {
        details.tags = 'All tags must be non-empty strings';
      } else {
        value.tags = value.tags.map(tag => tag.trim());
      }
    }
  }

  // If no fields provided => still valid (but may be rejected by controller)
  if (Object.keys(details).length > 0) {
    return {
      value: null,
      error: {
        message: 'Validation failed',
        details
      }
    };
  }

  return { value, error: null };
}


module.exports = {
  validatePostCreate,
  validatePostUpdate
};