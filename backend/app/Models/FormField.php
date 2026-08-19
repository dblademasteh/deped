<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'key',
        'type',
        'dropdown_slug',
        'section',
        'placeholder',
        'required',
        'is_active',
        'sort_order',
        'col_span',
    ];

    protected $casts = [
        'required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'col_span' => 'integer',
    ];
}
