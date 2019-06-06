namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class typeChanged : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Tickets", "User_Id", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Tickets", "User_Id", c => c.Int(nullable: false));
        }
    }
}
