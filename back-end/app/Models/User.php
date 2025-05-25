<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens; // Import HasApiTokens trait
use Illuminate\Contracts\Auth\CanResetPassword;

use App\Models\FamilyMember;

class User extends Authenticatable implements CanResetPassword
{
    use HasFactory, Notifiable, HasApiTokens; // Include HasApiTokens in the use statement

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'email_sha1_hash',
        'membership_number',

        'name_arabic',
        'name_english',
        'gender',
        'area',
        'city',
        'neighborhood',
        'profession',
        'currently_working',
        'status',
        'family_living_with_you',
        'number_of_family_members',
        'mobile_number',
        'alternative_mobile_number',
        'note',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Add this to your User model
    public function familyMembers()
    {
        return $this->hasMany(FamilyMember::class);
    }
}
