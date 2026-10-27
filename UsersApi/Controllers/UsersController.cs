using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.NativeInterop;
using UsersApi.Data;
using UsersApi.Models;

namespace UsersApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await db.Users
            .AsNoTracking()
            .OrderBy(user => user.Id)
            .ToListAsync(cancellationToken);

        return Ok(users);
    }

    [HttpPatch]
    public async Task<ActionResult<User>> EditUser(User user, CancellationToken cancellationToken)
    {
        var existingUser = await db.Users
            .FirstOrDefaultAsync(u => u.Id == user.Id, cancellationToken);

        if (existingUser is null)
            return NotFound();

        existingUser.Name = user.Name;
        existingUser.Email = user.Email;

        db.Update(existingUser);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(existingUser);
    }

    [HttpDelete("{Id}")]
    public async Task<ActionResult<User>> DeleteUser(int Id)
    {
        var existingUser = await db.Users.FindAsync(new object[] { Id });

        if (existingUser is null)
            return NotFound();

        db.Users.Remove(existingUser);
        await db.SaveChangesAsync();

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<User>> AddUser(User user)
    {
        var existingUser = await db.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (existingUser is not null)
            return Problem("User with this email already exists.");

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Ok();
    }
}