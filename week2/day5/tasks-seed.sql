
USE fullstack_training;

INSERT INTO tasks
    (title, description, status, priority, created_by, assigned_to)
VALUES
    (
        'Create API documentation',
        'Document all task endpoints',
        'pending',
        'high',
        1,
        2
    ),
    (
        'Fix validation errors',
        'Check task request validation',
        'in_progress',
        'high',
        2,
        3
    ),
    (
        'Write unit tests',
        'Add tests for task endpoints',
        'pending',
        'medium',
        1,
        NULL
    ),
    (
        'Review database schema',
        'Review task table relationships',
        'completed',
        'low',
        3,
        1
    ),
    (
        'Test delete endpoint',
        'Verify task deletion behavior',
        'in_progress',
        'medium',
        2,
        NULL
    );
